/**
 * Component identifier
 */
const IDENTIFIER = "rss-list";

/**
 * Buttons props for event delegation
 */
const BUTTON_CLASS_VALUE = "active";
const BUTTON_URL_ATTR = "url";
const BUTTON_CLASS_TIMEOUT = 1000;

/**
 * Shadow DOM style
 */
const CSS = `
:host {
    menu {
      background-color: #222;
      padding: 1rem;
      position: fixed;
      width: 100%;
      z-index: 9999999;
      color: #ccc;
      box-shadow: 0px 0px 15px #000a;
      font-family: sans-serif;
      font-size: 1rem;
      border-bottom: 1px solid #333;
    }

    * {
        margin: 0;
        padding: 0;
    }

    a {
        color: inherit;
        text-decoration: none;

        &:hover {
            color: #fff;
        }
    }

    button {
        display: inline-block;
        border: none;
        padding: 2px 5px 3px;
        margin-right: 1rem;
        font-size: .75rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: bold;
        background-color: #666;
        transition: all .5s cubic-bezier(.19, 1, .22, 1);

        &:hover {
            cursor: pointer;
            background-color: #aaa;
        }

        &:active {
            background-color: #fff;
            cursor: pointer;
            color: #000;
        }

        &.active {
            background-color: #fff;
            cursor: pointer;
            color: #000;
            transition: all .5s cubic-bezier(.68, -0.55, .27, 1.55);
        }
    }

    ul {
        list-style: none;

        & li:not(:last-child) {
            border-bottom: 1px solid #444;
            padding: 0 0 .5rem 0;
            margin-bottom: .5rem;
        }
    }
}`;

/**
 * Search and return all RSS items
 */
const getAllRssItems = () => {
  const selector = `link[rel="alternate"][type="application/rss+xml"]`;
  return document.querySelectorAll(selector);
};

/**
 * Search in page if the element has been already created
 */
const elementAlreadyExists = () => {
  return !!document.getElementById(IDENTIFIER);
};

/**
 * Render the found RSS <link> nodes in an innerHtml
 * compatible string to use in the shadowDom template
 */
const renderList = (nodeList) => {
  return [...nodeList]
    .map((item) => {
      const href = item.href;
      const title = item.title || item.href;
      return `
        <li>
            <button data-url="${href}">copy</button>
            <a href="${href}">${title}</a>
        </li>`;
    })
    .join("");
};

/**
 * Delegate the click event on the button
 * for copy the URL in the clipboard
 */
const delegateClickEventTo = (host) => {
  // on the root element
  host.addEventListener("click", (event) => {
    const trg = event.originalTarget;

    // Identify the button having the URL property
    if (BUTTON_URL_ATTR in trg.dataset) {
      // Copy to clipboard
      navigator.clipboard.writeText(trg.dataset[BUTTON_URL_ATTR]);

      // Play with classes
      const cls = BUTTON_CLASS_VALUE;
      trg.classList.add(cls);
      setTimeout(() => trg.classList.remove(cls), BUTTON_CLASS_TIMEOUT);
    }
  });
};

/**
 * Render the component DIV creating the shadow DOM
 * and attaching the style
 */
const createComponent = (items) => {
  const host = document.createElement("div");
  host.id = IDENTIFIER;
  host.attachShadow({ mode: "open" });

  host.shadowRoot.innerHTML = `
    <style>${CSS}</style>
    <menu><ul>${renderList(items)}</ul></menu>
  `;

  return host;
};

/**
 * Attach the component in the page
 */
const attachComponent = (host) => {
  const root = document.documentElement;
  const target = root.firstChild;
  root.insertBefore(host, target);
};

// Check for elements in page
const items = getAllRssItems();
const exists = elementAlreadyExists();

// Render and attach the component if possible
if (items.length > 0 && !exists) {
  const host = createComponent(items);
  delegateClickEventTo(host);
  attachComponent(host);
}
