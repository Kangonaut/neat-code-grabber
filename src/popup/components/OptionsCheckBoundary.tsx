import { ReactNode, useEffect, useState } from "react";
import OptionsService from "../../services/options";
import { Container, Link, Skeleton, Text } from "@chakra-ui/react";

interface OptionsCheckBoundaryProps {
    children?: ReactNode;
}

function OptionsCheckBoundary({ children }: OptionsCheckBoundaryProps) {
    const [isValid, setIsValid] = useState<boolean | null>(null);

    async function checkOptions() {
        console.log("checking options");
        const isValid = await OptionsService.checkOptions();
        setIsValid(isValid);
    }

    useEffect(() => {
        checkOptions();
    }, []);

    if (isValid) {
        return children;
    } else if (isValid === false) {
        return <>
            <Container m="auto" centerContent>
                <Text fontStyle="italic" fontSize="lg" color="gray">Please finish setup by going to the <Link color="teal.500" href="./src/options/index.html" target="_blank">options</Link> page.</Text>
            </Container>
        </>;
    } else {
        return <Skeleton />;
    }
}

export default OptionsCheckBoundary;