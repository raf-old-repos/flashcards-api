import type { GetStaticPropsResult, NextPage } from "next";

type Props = {}

const DefaultPage: NextPage<Props> = () => {
    return (<>
    </>)
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<Props>> => {
    // database stuff here
    return {
        props: {

        }
    }
}


export default DefaultPage