/* Utility to show content into the view */
import {ID_INPUT_SEARCH_VIEW_ELEMENT, ID_RESULT_CONTENT_ITEM_ELEMENT} from './config';

export const showLoading = () => {
  const contentResult = document.getElementById(ID_INPUT_SEARCH_VIEW_ELEMENT);
  contentResult.classList.add("loading");
};
export const hideLoading = () => {
  const contentResult = document.getElementById(ID_INPUT_SEARCH_VIEW_ELEMENT);
  contentResult.classList.remove("loading");
};

export const createItemResult = (res, searchTerm) => {
  const name = res.name;
  const div = document.createElement("div");
  div.setAttribute("class", "result-item");
  div.setAttribute("data-id", res.id);
  div.setAttribute("data-name", name);
  const indexSearch = name.toLowerCase().search(searchTerm);
  if (indexSearch !== -1 && searchTerm !== undefined) {
    const wordSearch = document.createElement("strong");
    wordSearch.setAttribute("data-id", res.id);
    wordSearch.setAttribute("data-name", name);
    wordSearch.innerHTML = name.substring(
      indexSearch,
      indexSearch + searchTerm.length
    );
    const start = document.createTextNode(name.substring(0, indexSearch));
    const end = document.createTextNode(
      name.substring(indexSearch + searchTerm.length, name.length)
    );
    div.appendChild(start);
    div.appendChild(wordSearch);
    div.appendChild(end);
  } else {
    div.innerHTML = name;
  }
  return div;
};

export const clearResultView = () => {
  const contentResult = document.getElementById("result-content-item");
  while (contentResult.firstChild) {
    contentResult.removeChild(contentResult.firstChild);
  }
};

export const viewResult = (arrResult, searchTerm) => {
  clearResultView();
  const contentResult = document.getElementById("result-content-item");
  if (arrResult.length > 0) {
    arrResult.forEach((res) => {
      contentResult.appendChild(createItemResult(res, searchTerm));
    });
  } else {
    contentResult.appendChild(document.createTextNode(""));
  }
};

export const showBoxSearch = () => {
  const contentResult = document.getElementById(ID_RESULT_CONTENT_ITEM_ELEMENT);
  contentResult.classList.remove("hide");
  contentResult.classList.add("show");
};

export const hideBoxSearch = () => {
  const contentResult = document.getElementById(ID_RESULT_CONTENT_ITEM_ELEMENT);
  contentResult.classList.remove("show");
  contentResult.classList.add("hide");
};
