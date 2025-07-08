import React from "react";

export const Spotify = ({
  link,
  style = {},
  wide = false,
  width = wide ? "100%" : "100%",
  height = wide ? 80 : 180,
  allow = "encrypted-media",
  ...props
}) => {
  const url = new URL(link);
  url.pathname = url.pathname.replace(/\/intl-\w+\//, "/");
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: wide ? "20%" : "30%",
      }}
    >
      <iframe
        title="Spotify Web Player"
        src={`https://open.spotify.com/embed${url.pathname}`}
        width="100%"
        height="100%"
        allow={allow}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: { width },
          height: { height },
          borderRadius: 8,
          ...style,
        }}
        {...props}
      />
    </div>
  );
};
