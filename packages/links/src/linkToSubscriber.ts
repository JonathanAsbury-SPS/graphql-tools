import { ApolloLink, execute } from '@apollo/client/link/core';
import { Observable } from '@apollo/client/utilities';

import { ExecutionResult, observableToAsyncIterable } from '@graphql-tools/utils';
import { Subscriber, ExecutionParams } from '@graphql-tools/delegate';

export const linkToSubscriber = (link: ApolloLink): Subscriber => async <TReturn, TArgs, TContext>(
  params: ExecutionParams<TArgs, TContext>
): Promise<ExecutionResult<TReturn> | AsyncIterator<ExecutionResult<TReturn>>> => {
  const { document, variables, extensions, context, info } = params;
  return observableToAsyncIterable<ExecutionResult<TReturn>>(
    execute(link, {
      query: document,
      variables,
      context: {
        graphqlContext: context,
        graphqlResolveInfo: info,
        clientAwareness: {},
      },
      extensions,
    }) as Observable<ExecutionResult<TReturn>>
  )[Symbol.asyncIterator]();
};
