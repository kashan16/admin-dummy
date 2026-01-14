'use client';

import { MOCK_OUTLETS } from "@/lib/mockData";
import { Outlet, OutletScope } from "@/types";
import { createContext, useContext, useMemo, useState } from "react";

interface OutletContextValue {
    outlets: Outlet[];
    selectedOutlet: OutletScope;
    setSelectedOutlet: (value: OutletScope) => void;
    isMultiOutlet: boolean;
}

const OutletContext = createContext<OutletContextValue | null>(null);

export function OutletProvider({ children }: { children: React.ReactNode }) {
    const outlets = MOCK_OUTLETS;
    const isMultiOutlet = outlets.length > 1;

    const [selectedOutlet, setSelectedOutlet] = useState<OutletScope>(isMultiOutlet ? 'ALL' : outlets[0]?.id);

    const value = useMemo(
        () => ({ outlets, selectedOutlet, setSelectedOutlet, isMultiOutlet }),
        [outlets, selectedOutlet, isMultiOutlet]
    );

    return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>;
}

export function useOutlet() {
    const ctx = useContext(OutletContext);
    if (!ctx) throw new Error('useOutlet must be used inside OutletProvider');
    return ctx;
}