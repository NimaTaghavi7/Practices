import { Card, CardBody, Skeleton, SkeletonText } from "@chakra-ui/react";

export default function ProductSkeleton() {
  return (
    <Card
      height="100%"
      border="1px solid"
      borderColor="#333"
      background="#0a0a0a"
    >
      <Skeleton
        height="220px"
        margin="18px"
        borderRadius="10px"
        startColor="#222"
        endColor="#333"
      />

      <CardBody padding="16px">
        <SkeletonText
          noOfLines={2}
          spacing={3}
          skeletonHeight="16px"
          startColor="#222"
          endColor="#333"
        />

        <Skeleton
          height="16px"
          width="60%"
          marginTop="12px"
          borderRadius="5px"
          startColor="#222"
          endColor="#333"
        />

        <Skeleton
          height="14px"
          width="40%"
          marginTop="8px"
          borderRadius="5px"
          startColor="#222"
          endColor="#333"
        />

        <Skeleton
          height="14px"
          width="50%"
          marginTop="12px"
          borderRadius="5px"
          startColor="#222"
          endColor="#333"
        />
      </CardBody>
    </Card>
  );
}
