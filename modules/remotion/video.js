import '../../public/global.css'
import { Video, Img, useVideoConfig, staticFile } from 'remotion';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

export const VideoBackground = ({ newsData }) => {
    const { width, height } = useVideoConfig();

    // console.error("Data:", JSON.stringify(newsData, null, 2));
    // console.error("Quotes:", newsData[0].quotes);

    if (!newsData) {
        return null;
    }

    const textVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Helmet>
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            {Array.isArray(newsData) && newsData.length > 0 && (
                <Video
                    src={staticFile(`${newsData[0].video}`)}
                    style={{
                        width: width,
                        height: height,
                        objectFit: 'cover',
                    }}
                />
            )}

            {/* Animated Text Overlay */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{
                    position: 'absolute',
                    top: '700px',
                    width: '100%'
                }}
            >
                {Array.isArray(newsData) && newsData.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginLeft: '100px',
                            marginRight: '100px'
                        }}
                    >
                        <motion.p
                            variants={textVariants}
                            style={{
                                color: 'white',
                                fontSize: '68px',
                                textAlign: 'center',
                                marginBottom: -40,
                                fontWeight: 'bold',
                                fontFamily: "'Roboto','Noto Sans Devanagari', sans-serif"
                            }}
                        >
                            {newsData[0].quotes}
                        </motion.p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};