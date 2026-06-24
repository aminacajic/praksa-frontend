export function apsolutnaSlika(putanja) {
  if (!putanja) return "/images/placeholder.png";
  if (/^https?:\/\//i.test(putanja) || putanja.startsWith("data:")) return putanja;
  const ociscena = putanja.replace(/^\.\//, "").replace(/^\/+/, "");
  return "/" + ociscena;
}