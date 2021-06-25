import { ChatUsernamePipe } from './chat-username.pipe';

describe('ChatUsernamePipe', () => {
  it('create an instance', () => {
    const pipe = new ChatUsernamePipe();
    expect(pipe).toBeTruthy();
  });
});
