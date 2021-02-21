import React from "../pkg/react.js";
import {useHistory} from "../pkg/react-router.js";
import styled from "../pkg/styled-components.js";
import {openURL} from "../helpers/navigation.js";
import {useCurrentSubject} from "../helpers/useCurrentSubject.js";
import {useStore} from "../atomic-react/hooks.js";
function AtomicLink({children, url}) {
  const [currentUrl] = useCurrentSubject();
  const history = useHistory();
  const store = useStore();
  store.fetchResource(url);
  const handleClick = (e) => {
    e.preventDefault();
    if (currentUrl == url) {
      return;
    }
    history.push(openURL(url));
  };
  return /* @__PURE__ */ React.createElement(LinkView, {
    about: url,
    onClick: handleClick,
    href: url,
    disabled: currentUrl == url,
    tabIndex: currentUrl == url ? -1 : 0
  }, children);
}
export const LinkView = styled.a`
  color: ${(props) => props.disabled ? props.theme.colors.text : props.theme.colors.main};
  text-decoration: none;
  cursor: pointer;
  pointer-events: ${(props) => props.disabled ? "none" : "auto"};

  &:hover {
    color: ${(props) => props.theme.colors.mainLight};
  }
  &:active {
    color: ${(props) => props.theme.colors.mainDark};
  }
`;
export default AtomicLink;
