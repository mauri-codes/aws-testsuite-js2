
function sum (a:number, b:number) {
    return a + b;
}

test('basic again', () => {
  expect(sum(1, 2)).toBe(3);
});