import { Notice } from './notice-temp';

export function BetaNotice() {
  return (
    <Notice variant='warning'>
      This is an early version of our app — a proof-of-concept currently in beta. You may encounter
      bugs or missing features. Thanks for trying it out and helping us improve!
    </Notice>
  );
}
