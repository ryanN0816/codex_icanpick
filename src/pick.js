export function pickOption(options, random = Math.random) {
  const valid = options.map(value => value.trim()).filter(Boolean);
  if (valid.length < 2) throw new Error('선택지를 두 개 이상 입력해 주세요.');
  return valid[Math.floor(random() * valid.length)];
}
