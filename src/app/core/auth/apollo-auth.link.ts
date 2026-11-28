import { ApolloLink } from '@apollo/client/link';
import { Observable } from 'rxjs';

export interface SessionPort {
  accessToken(): string | null;
  refresh(): Promise<boolean>;
}

const RETRIED = 'authRetried';

const isUnauthorized = (result: ApolloLink.Result): boolean =>
  (result.errors ?? []).some((error) => error.extensions?.['classification'] === 'UNAUTHORIZED');

const requestLink = (session: SessionPort): ApolloLink =>
  new ApolloLink((operation, forward) => {
    const token = session.accessToken();
    if (token !== null) {
      operation.setContext((previous: { headers?: Record<string, string> }) => ({
        headers: { ...previous.headers, Authorization: `Bearer ${token}` },
      }));
    }
    return forward(operation);
  });

const retryLink = (session: SessionPort): ApolloLink =>
  new ApolloLink(
    (operation, forward) =>
      new Observable<ApolloLink.Result>((observer) => {
        let retrying = false;
        const subscription = forward(operation).subscribe({
          next: (result) => {
            if (operation.getContext()[RETRIED] === true || !isUnauthorized(result)) {
              observer.next(result);
              return;
            }
            retrying = true;
            operation.setContext({ [RETRIED]: true });
            void session.refresh().then((refreshed) => {
              if (!refreshed) {
                observer.next(result);
                observer.complete();
                return;
              }
              forward(operation).subscribe(observer);
            });
          },
          error: (error) => observer.error(error),
          complete: () => {
            if (!retrying) {
              observer.complete();
            }
          },
        });
        return () => subscription.unsubscribe();
      }),
  );

export const authLinks = (session: SessionPort): ApolloLink =>
  ApolloLink.from([retryLink(session), requestLink(session)]);
