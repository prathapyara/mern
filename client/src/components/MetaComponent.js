import { Helmet, HelmetProvider } from "react-helmet-async";

export const MetaHelmetComponent = ({ title, description }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>
        </HelmetProvider>
    )
}