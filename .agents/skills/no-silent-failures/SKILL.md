---
name: no-silent-failures
description: Use when writing, changing or reviewing a try/catch, a promise rejection handler or any other error path, in any language. Holds what the always-on core rule leaves out, namely the prohibited and required patterns in TypeScript, JavaScript and Java, the two annotation forms for a catch that is a no-op by design, the two ESLint rules that enforce the empty-catch case, and what a reviewer has to check by hand.
---

# No silent failures: examples and tooling

The rule itself is always loaded, in `.agents/rules/core.md` under "Error handling: no silent failures". This skill holds the worked examples, the lint setup and the review checklist.

## The rule

Every error path does at least one of:

1. Re-throw the error to the caller.
2. Log the error and surface it to the user (toast, banner, error state).
3. Route the error to the error tracker.

Empty catches are prohibited. So are inert catches: the error is caught but never read, or it is only logged. A catch that is a no-op by design carries an annotation with a real reason.

## Why

A defensible reason to swallow an error ("never let X break Y") is easily taken one step too far, into "and do not even log it". The team then learns about the breakage from user reports. One audit closed nine findings of this kind, and the fix wave reintroduced three. In that audit a whole push-notification feature failed silently for every build with a missing entitlement, because the registration error was caught with `catch {}`.

## Prohibited patterns

### TypeScript / JavaScript

```ts
// WRONG: empty catch swallows everything
try {
  await registerPushToken();
} catch {
  // Never let push-token retry break the foreground handler.
}

// WRONG: the caught error is named but never used or routed anywhere
try {
  await criticalPath();
} catch (e) {
  // optional feature, ignore
}

// WRONG: inert catch, it logs but does nothing actionable
try {
  await uploadLocation();
} catch (e) {
  console.log(e); // no re-throw, no state, no error tracker
}
```

### Java

```java
// WRONG: silent swallow
try {
    notifyFriends();
} catch (Exception e) {
    // ignore
}

// WRONG: log-only on a critical path, with no surface and no re-throw
try {
    dispatchSilentPush();
} catch (Exception e) {
    log.warn("dispatch failed");  // no stack trace, no re-throw, no metric
}
```

## Required patterns

### TypeScript / JavaScript

```ts
// Re-throw: the caller decides what to do
try {
  await criticalPath();
} catch (e) {
  console.warn("[feature] criticalPath failed", e);
  throw e;
}

// Log and surface: set UI state the user can see
try {
  await uploadLocation();
} catch (e) {
  const message = e instanceof Error ? e.message : "Upload failed";
  console.warn("[useLocation] PUT failed", message);
  setLastPostError(message);
}
```

### Java

```java
// Route to the error-level logger with the exception attached, then propagate or fail loudly
try {
    notifyFriends();
} catch (Exception e) {
    loggingService.error(
        LogPrefix.fromClass(getClass()),
        LogLayer.SERVICE,
        "notifyFriends failed",
        e
    );
    throw new BusinessException(ExceptionError.NOTIFY_FAILED);
}
```

The logger and exception types above are an illustration. Use the ones the repo's own logging and exception conventions define.

## A catch that is a no-op by design

Cancellation during cleanup and a probe for an optional feature are the usual cases. The annotation's form follows the language, and the `reason:` part is never optional.

In TypeScript and JavaScript, ESLint is the tool being told, so the annotation is an ESLint suppression:

```ts
try {
  await preloadOptionalAsset();
} catch {
  // eslint-disable-next-line no-empty -- reason: optional CDN warm-up; failure
  // is harmless and the next request will retry through the main code path.
}
```

In a language ESLint does not lint (Java, Kotlin, Swift) an ESLint suppression is inert and misleading: a reader who greps for real suppressions gets false hits in a file ESLint never reads. Write the marker instead:

```java
try {
    Class.forName(OPTIONAL_EXPORTER_CLASS);
    exporterAvailable = true;
} catch (ClassNotFoundException e) {
    // rule-10-no-op -- reason: probe for an optional dependency; its absence is
    // an expected state and exporterAvailable stays false.
}
```

## Lint setup (TypeScript and JavaScript)

Every TypeScript project enables both rules:

- `no-empty` with `allowEmptyCatch: false` fails on `catch {}` and on `catch (e) {}` with no body.
- `@typescript-eslint/no-unused-vars` with `caughtErrors: 'all'` fails on `catch (e) { /* never reads e */ }`.

When a project lacks them, copy the configuration from a project in the repo that already applies both.

## What review checks by hand

- The catch that logs but does not surface has no clean lint rule. Check every changed catch for a re-throw, user-visible state or a route to the error tracker.
- Backend code logs an unexpected exception on a critical path at error level with the exception attached, so that it is visible in error aggregation. A warn line without the stack trace does not count.
- Every no-op annotation has a reason, and the reason holds.
