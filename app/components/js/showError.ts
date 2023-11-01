export default function showMessage(
  setError: (err: string) => void,
  err: string
) {
  setError(err);
  setTimeout(() => setError(""), 2000);
}
