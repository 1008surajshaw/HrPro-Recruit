import { getServerSession, Session } from 'next-auth';
import { options } from './auth';
import { ErrorHandler } from './error';
import { withServerActionAsyncCatcher } from './async-catch';

// Added session also if we want to use ID
type withNonUserServerActionType<T, R> = (
  session: Session,
  args?: T
) => Promise<R>;

export function withNonUserServerAction<T, R>(
  serverAction: withNonUserServerActionType<T, R>
): (args?: T) => Promise<R> {
  return withServerActionAsyncCatcher(async (args?: T) => {
    const session = await getServerSession(options);
    if (!session || session.user.role === 'USER'  ) {
      throw new ErrorHandler(
        'You must be authenticated to access this resource.',
        'UNAUTHORIZED'
      );
    }
    return await serverAction(session, args);
  });
}
