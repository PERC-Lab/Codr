import { useEffect, useState } from "react";
import { useAnnotation } from "src/AnnotationContext";

/**
 *
 */
export const useNavigator = function useNavigator() {
  const [annotation] = useAnnotation();
  const [size, setSize] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();

  useEffect(() => {
    setSize(annotation?.size);
    setNext(annotation?.next);
    setPrev(annotation?.prev);
  }, [annotation?.size, annotation?.next, annotation?.prev]);

  const resolve = { size, next, prev };

  resolve.getNext = function () {
    return next;
  };

  resolve.getPrev = function () {
    return prev;
  };

  resolve.hasNext = function () {
    return !!next;
  };

  resolve.hasPrev = function () {
    return !!prev;
  };

  return resolve;
};
