const POLL_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 500;

const describeError = (error: unknown): string => {
  return error instanceof Error ? error.message : String(error);
};

const describeValue = (value: unknown): string => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const wait = async (milliseconds: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export async function pollForDerivedValue<T>({
  description,
  read,
  matches,
}: {
  description: string;
  read: () => Promise<T>;
  matches: (value: T) => boolean;
}): Promise<T> {
  const startedAt = Date.now();
  let attempts = 0;
  let lastValue: T | undefined;
  let lastError: unknown;

  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    attempts += 1;

    try {
      lastValue = await read();
      lastError = undefined;

      if (matches(lastValue)) {
        return lastValue;
      }
    } catch (error) {
      lastError = error;
    }

    await wait(POLL_INTERVAL_MS);
  }

  const lastObservation = lastError
    ? `Last query error: ${describeError(lastError)}`
    : `Last value: ${describeValue(lastValue)}`;

  throw new Error(
    `Timed out after ${POLL_TIMEOUT_MS}ms and ${attempts} attempts waiting for ${description}. ${lastObservation}`,
  );
}

export async function cleanupDerivedValueRecord({
  description,
  destroy,
  testError,
}: {
  description: string;
  destroy: () => Promise<unknown>;
  testError?: unknown;
}): Promise<void> {
  try {
    await destroy();
  } catch (cleanupError) {
    const cleanupMessage = `Cleanup failed for ${description}: ${describeError(cleanupError)}`;

    if (testError) {
      throw new Error(`${describeError(testError)} ${cleanupMessage}`);
    }

    throw new Error(cleanupMessage);
  }
}
