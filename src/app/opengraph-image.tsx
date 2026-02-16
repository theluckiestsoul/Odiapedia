import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Odiapedia - Discover Odisha';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundImage: 'linear-gradient(to bottom right, #f0fdfa, #f8fafc)', // teal-50 to slate-50
                    position: 'relative',
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #ccfbf1 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ccfbf1 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        opacity: 0.5,
                    }}
                />

                {/* Logo/Icon */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0d9488, #0f766e)', // teal-600 to teal-700
                        boxShadow: '0 10px 30px -10px rgba(13, 148, 136, 0.5)',
                        fontSize: '60px',
                        marginBottom: '40px',
                    }}
                >
                    ⭕
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #134e4a, #0f766e)', // teal-900 to teal-700
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: '20px',
                            lineHeight: 1.1,
                            padding: '0 40px',
                            fontFamily: 'serif',
                        }}
                    >
                        Odiapedia
                    </h1>
                    <p
                        style={{
                            fontSize: '32px',
                            color: '#334155', // slate-700
                            maxWidth: '800px',
                            lineHeight: 1.5,
                            fontWeight: 500,
                        }}
                    >
                        Discover the Culture, History & Heritage of Odisha
                    </p>
                </div>

                {/* Decorative footer */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '24px',
                        color: '#0d9488', // teal-600
                        fontWeight: 600,
                    }}
                >
                    odiapedia.com
                </div>

                {/* Corner Accents */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', background: 'radial-gradient(circle at top left, #ccfbf1 0%, transparent 70%)', opacity: 0.8 }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle at bottom right, #ffe4e6 0%, transparent 70%)', opacity: 0.6 }} />
            </div>
        ),
        {
            ...size,
        }
    );
}
