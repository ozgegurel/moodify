import React from "react";

export const Spotify = ({
  link,
  style = {},
  wide = false,
  allow = "encrypted-media",
  ...props
}) => {
  const url = new URL(link);
  url.pathname = url.pathname.replace(/\/intl-\w+\//, "/");

  // Spotify embed standard height is 152px for compact, 352px for full
  const iframeHeight = wide ? 352 : 152;

  return (
    <div className="w-full overflow-hidden rounded-xl">
      <iframe
        title="Spotify Web Player"
        src={`https://open.spotify.com/embed${url.pathname}`}
        width="100%"
        height={iframeHeight}
        allow={allow}
        style={{
          backgroundColor: "transparent",
          border: "none",
          display: "block",
          margin: 0,
          padding: 0,
          width: "100%",
          ...style,
        }}
        className="w-full"
        {...props}
      />
    </div>
  );
};
