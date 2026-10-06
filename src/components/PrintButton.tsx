"use client";

import Icon from "./Icon";

export default function PrintButton({ label = "Print" }: { label?: string }) {
    return (
        <button type="button" onClick={() => window.print()} className="btn-ghost !py-2 print:hidden">
            <Icon name="list" className="h-4 w-4" />{label}
        </button>
    );
}
