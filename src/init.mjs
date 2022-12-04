export function init(id) {
  try {
    return JSON.parse(document.getElementById(id).textContent);
  } catch (err) {
    return { name: "", loading: true };
  }
}
