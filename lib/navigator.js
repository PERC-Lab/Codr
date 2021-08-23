import { useEffect, useState } from "react";
import { useAnnotation } from "src/AnnotationContext";

/**
 * A wrapper to useAnnotation for navigating the dataset.
 */
export const useNavigator = function useNavigator() {
  const [annotation] = useAnnotation();
  const [size, setSize] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [index, setIndex] = useState();

  useEffect(() => {
    setSize(annotation?.size);
    setNext(annotation?.next ? annotation.next : undefined);
    setPrev(annotation?.prev ? annotation.prev : undefined);
    setIndex(annotation?.index);
  }, [annotation?.size, annotation?.next, annotation?.prev]);

  const resolve = { size, next, prev, index };

  resolve.getNext = function () {
    return next;
  };

  resolve.getPrev = function () {
    return prev;
  };

  resolve.hasNext = function () {
    return !!next && index !== size - 1;
  };

  resolve.hasPrev = function () {
    return !!prev && index !== 0;
  };

  return resolve;
};
