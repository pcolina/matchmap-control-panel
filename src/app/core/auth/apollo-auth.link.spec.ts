import type { ApolloClient } from '@apollo/client/core';
import { ApolloLink } from '@apollo/client/link';
import { gql } from '@apollo/client/core';
import { firstValueFrom, of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { authLinks, SessionPort } from './apollo-auth.link';

const query = gql`
  query Countries {
    countries {
      code
    }
  }
`;

const unauthorized = { errors: [{ message: 'no', extensions: { classification: 'UNAUTHORIZED' } }] };
const data = { data: { countries: [] } };

const session = (initial: string | null, refreshed: string | null) => {
  let token = initial;
  const port: SessionPort = {
    accessToken: () => token,
    refresh: vi.fn(async () => {
      if (refreshed === null) {
        return false;
      }
      token = refreshed;
      return true;
    }),
  };
  return port;
};

const run = (port: SessionPort, results: unknown[]) => {
  const seen: (string | undefined)[] = [];
  const terminating = new ApolloLink((operation) => {
    const headers = operation.getContext()['headers'] as Record<string, string> | undefined;
    seen.push(headers?.['Authorization']);
    return of(results.shift() as ApolloLink.Result);
  });
  const link = ApolloLink.from([authLinks(port), terminating]);
  const result = firstValueFrom(ApolloLink.execute(link, { query }, { client: {} as ApolloClient }));
  return { result, seen };
};

describe('authLinks', () => {
  it('sends the bearer token of the current session', async () => {
    const port = session('token-1', null);
    const { result, seen } = run(port, [data]);

    expect(await result).toEqual(data);
    expect(seen).toEqual(['Bearer token-1']);
  });

  it('sends no Authorization header when there is no session', async () => {
    const port = session(null, null);
    const { result, seen } = run(port, [data]);

    expect(await result).toEqual(data);
    expect(seen).toEqual([undefined]);
  });

  it('refreshes once after UNAUTHORIZED and repeats the operation with the new token', async () => {
    const port = session('token-1', 'token-2');
    const { result, seen } = run(port, [unauthorized, data]);

    expect(await result).toEqual(data);
    expect(port.refresh).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(['Bearer token-1', 'Bearer token-2']);
  });

  it('does not refresh again when the repeated operation is unauthorized too', async () => {
    const port = session('token-1', 'token-2');
    const { result, seen } = run(port, [unauthorized, unauthorized]);

    expect(await result).toEqual(unauthorized);
    expect(port.refresh).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(['Bearer token-1', 'Bearer token-2']);
  });

  it('returns the original error when the refresh fails and does not repeat', async () => {
    const port = session('token-1', null);
    const { result, seen } = run(port, [unauthorized]);

    expect(await result).toEqual(unauthorized);
    expect(port.refresh).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(['Bearer token-1']);
  });
});
