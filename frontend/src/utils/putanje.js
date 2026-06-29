export function apsolutnaSlika(putanja) {
  if (!putanja) return "/images/placeholder.png";
  if (/^(https?|blob|data):/i.test(putanja)) return putanja;
  const ociscena = putanja.replace(/^\.\//, "").replace(/^\/+/, "");
  return "/" + ociscena;
}