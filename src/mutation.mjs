export default function () {
  const observer = new MutationObserver((mutations) =>
    mutations.forEach((mutation) => {
      console.log(mutation);
    })
  );

  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
  });
}
