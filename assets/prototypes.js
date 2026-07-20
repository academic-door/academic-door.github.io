(function () {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-mobile-nav]");

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navigation?.toggleAttribute("data-open", !expanded);
  });

  navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton?.setAttribute("aria-expanded", "false");
      navigation.removeAttribute("data-open");
    });
  });

  const tabs = Array.from(document.querySelectorAll("[data-research-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-research-panel]"));
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.researchTab;
      tabs.forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((panel) => {
        panel.hidden = panel.dataset.researchPanel !== target;
      });
    });
  });
})();
