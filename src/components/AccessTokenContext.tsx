"use client";

import { createContext, useContext } from "react";

type AccessTokenContextType = string | null;

const AccessTokenContext = createContext<AccessTokenContextType>(null);

export const useAccessToken = () => useContext(AccessTokenContext);

export default AccessTokenContext;
