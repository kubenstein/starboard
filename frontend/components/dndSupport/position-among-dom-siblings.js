export default function positionAmongDOMSiblings(el) {
  let node = el;
  let position;
  for (position = -1; node; position += 1) { node = node.previousSibling; }
  return position;
}
