import { Heading, Text } from "@chakra-ui/react";
import { ProblemDetails } from "../../types";

interface ProblemDetailsProps {
    problemDetails: ProblemDetails;
}

function ProblemDetailsDisplay({ problemDetails }: ProblemDetailsProps) {
    return (
        <>
            <Heading size="sm">Problem</Heading>
            <Text>ID: {problemDetails.id}</Text>
            <Text>Title: {problemDetails.title}</Text>
        </>
    );
}

export default ProblemDetailsDisplay