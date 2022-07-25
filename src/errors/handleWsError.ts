import { HandleWsErrorArgs } from './types';

export const handleWsError = (args: HandleWsErrorArgs) => {
  const statusCode = args.err.statusCode || 500;
  const message = args.err.statusCode ? args.err.message : 'Server error';
  // console.log({
  //   status: statusCode,
  //   message,
  // });
  console.log(args.err);
};
