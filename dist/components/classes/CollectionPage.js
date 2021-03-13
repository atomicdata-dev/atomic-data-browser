import * as React from "../../pkg/react.js";
import styled from "../../pkg/styled-components.js";
import {useHotkeys} from "../../pkg/react-hotkeys-hook.js";
import {properties} from "../../helpers/urls.js";
import {useLocalStorage} from "../../helpers/useLocalStorage.js";
import {useViewport} from "../../helpers/useMedia.js";
import {useArray, useNumber, useResource, useString, useTitle} from "../../atomic-react/hooks.js";
import {Button} from "../Button.js";
import {ContainerFull} from "../Containers.js";
import Markdown from "../datatypes/Markdown.js";
import NewInstanceButton from "../NewInstanceButton.js";
import ResourceCard from "../ResourceCard.js";
import Table from "../Table.js";
import {useSubjectParam} from "../../helpers/useCurrentSubject.js";
import {DropDownList, DropDownMini} from "../forms/Dropdownlist.js";
var DisplayStyle;
(function(DisplayStyle2) {
  DisplayStyle2[DisplayStyle2["TABLE"] = 0] = "TABLE";
  DisplayStyle2[DisplayStyle2["CARDLIST"] = 1] = "CARDLIST";
})(DisplayStyle || (DisplayStyle = {}));
const displayStyleString = (style) => {
  switch (style) {
    case 1: {
      return "cards";
      break;
    }
    case 0: {
      return "table";
    }
  }
};
function Collection({resource}) {
  const title = useTitle(resource);
  const [description] = useString(resource, properties.description);
  const viewportWidth = useViewport();
  const defaultView = viewportWidth < 700 ? 1 : 0;
  const [displayStyle, setDisplayStyle] = useLocalStorage("CollectionDisplayStyle", defaultView);
  const [members] = useArray(resource, properties.collection.members);
  const [klass] = useString(resource, properties.collection.value);
  const [currentPage] = useNumber(resource, properties.collection.currentPage);
  const [totalPages] = useNumber(resource, properties.collection.totalPages);
  const [, setPage] = useSubjectParam("current_page");
  const [sortBy, setSortBy] = useSubjectParam("sort_by");
  const [classResource] = useResource(klass);
  const [requiredProps] = useArray(classResource, properties.requires);
  const [recommendedProps] = useArray(classResource, properties.recommends);
  const propsArrayFull = requiredProps.concat(recommendedProps);
  const handleToggleView = () => {
    setDisplayStyle(nextDisplayStyle());
  };
  function handlePrevPage() {
    if (currentPage !== 0) {
      () => setPage(currentPage - 1);
    }
  }
  function handleNextPage() {
    if (currentPage !== totalPages - 1) {
      () => setPage(currentPage + 1);
    }
  }
  function handleSetSort(by) {
    setSortBy(by);
  }
  const nextDisplayStyle = () => {
    switch (displayStyle) {
      case 1: {
        return 0;
      }
      case 0: {
        return 1;
      }
    }
  };
  useHotkeys("v", handleToggleView, {}, [displayStyle]);
  return /* @__PURE__ */ React.createElement(ContainerFull, {
    about: resource.getSubject()
  }, /* @__PURE__ */ React.createElement("h1", null, title), /* @__PURE__ */ React.createElement(Button, {
    subtle: true,
    onClick: handleToggleView
  }, displayStyleString(nextDisplayStyle()), " view"), klass && /* @__PURE__ */ React.createElement(NewInstanceButton, {
    subtle: true,
    klass
  }), totalPages > 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    subtle: true,
    onClick: handlePrevPage,
    disabled: currentPage == 0
  }, "prev page"), /* @__PURE__ */ React.createElement(Button, {
    subtle: true,
    onClick: handleNextPage,
    disabled: currentPage == totalPages - 1
  }, "next page")), /* @__PURE__ */ React.createElement(DropDownMini, null, /* @__PURE__ */ React.createElement(DropDownList, {
    placeholder: "sort by...",
    initial: sortBy,
    options: propsArrayFull,
    onUpdate: handleSetSort
  })), description && /* @__PURE__ */ React.createElement(Markdown, {
    text: description
  }), displayStyle == 1 && /* @__PURE__ */ React.createElement(CardList, {
    members
  }), displayStyle == 0 && /* @__PURE__ */ React.createElement(Table, {
    resource,
    members,
    columns: propsArrayFull
  }));
}
function CardList({members}) {
  return /* @__PURE__ */ React.createElement(Masonry, null, members.map((member) => /* @__PURE__ */ React.createElement(GridItem, {
    key: member
  }, /* @__PURE__ */ React.createElement(ResourceCard, {
    key: member,
    subject: member
  }))));
}
const GridItem = styled.div`
  margin: 0;
  /* display: grid; */
  /* grid-template-rows: 1fr auto; */
  margin-bottom: ${(props) => props.theme.margin}rem;
  break-inside: avoid;
  word-break: break-word;
`;
const Masonry = styled.div`
  column-count: 1;
  column-gap: ${(props) => props.theme.margin}rem;
  margin: ${(props) => props.theme.margin}rem auto;
  overflow: visible;
  box-sizing: border-box;

  @supports (grid-template-rows: masonry) {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: masonry;
    /* grid-gap: ${(props) => props.theme.margin}rem; */
    grid-column-gap: ${(props) => props.theme.margin}rem;
  }

  /* Masonry on small screens */
  @media only screen and (min-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
    column-count: 2;
  }
  /* Masonry on medium-sized screens */
  @media only screen and (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    column-count: 3;
  }
  /* Masonry on large screens */
  @media only screen and (min-width: 1800px) {
    grid-template-columns: repeat(4, 1fr);
    column-count: 4;
  }
`;
export default Collection;
