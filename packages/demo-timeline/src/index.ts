/**
 * A rule evaluated in declaration order. The first matching rule wins.
 *
 * This is the synchronous counterpart of the ordered event plans used by the
 * switchMap/exhaustMap demos, and deliberately has no Angular or RxJS runtime
 * dependency so it can be embedded in other clients.
 */
export interface OrderedRule<TInput, TResult> {
  matches(input: TInput): boolean;
  value: TResult;
}

/** Returns the value from the first matching rule, or the supplied fallback. */
export function selectFirstMatching<TInput, TResult>(
  input: TInput,
  rules: readonly OrderedRule<TInput, TResult>[],
  fallback: TResult
): TResult {
  return rules.find((rule) => rule.matches(input))?.value ?? fallback;
}
