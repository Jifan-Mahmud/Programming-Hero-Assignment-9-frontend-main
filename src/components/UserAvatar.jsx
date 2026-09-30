"use client";

import { useState, useEffect } from "react";
import { generateAvatarSvg, getSafeUserPhoto } from "../lib/avatar";

export default function UserAvatar({
  user,
  name,
  photoURL,
  className = "w-9 h-9 rounded-full object-cover border-2 border-teal-500 shadow-sm",
  size = 36,
}) {
  const displayName = user?.name || name || "User";
  const initialSrc = getSafeUserPhoto(user || { name: displayName, photoURL });
  const [src, setSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const nextSrc = getSafeUserPhoto(user || photoURL);
    setSrc(nextSrc);
    setHasError(false);
  }, [user?.photoURL, user?.image, photoURL, displayName]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setSrc(generateAvatarSvg(displayName));
    }
  };

  return (
    <img
      src={src}
      alt={displayName}
      width={size}
      height={size}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
      loading="eager"
    />
  );
}
