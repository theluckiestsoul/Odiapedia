import React from 'react';

type JsonLdProps = {
    data: Record<string, any> | Record<string, any>[];
};

const JsonLd = ({ data }: JsonLdProps) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};

export default JsonLd;
