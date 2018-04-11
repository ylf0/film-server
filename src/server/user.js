import randomstring from 'randomstring';

/**
 * 计算 Token；
 */
export function calculateToken() {
  return `${randomstring.generate(20)}${Date.now()}${randomstring.generate(20)}`;
}
