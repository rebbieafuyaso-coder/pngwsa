import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const {pathname, hash} = useLocation();

  useEffect(() => {
    if (!hash) {
      window,scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });
    return;
    }

    const id = decodeURIComponent(hash.slice(1));

    let attempts = 0;
    const maxAttempts = 20;

    const findAndScroll = () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "instant",
          block: "start",
        });

        return;
      }

      if (attemps < maxAttempts) {
        attempts++;
        requestAnimationFrame(findAndScroll);
      }
    };
    requestAnimationFrame()
  }, [pathname, hash])

  return null;
}

export default ScrollToTop;