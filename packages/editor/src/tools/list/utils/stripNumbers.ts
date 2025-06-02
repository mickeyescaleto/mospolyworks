export default function stripNumbers(input: string): string {
  return input.replace(/\D+/g, '');
}
