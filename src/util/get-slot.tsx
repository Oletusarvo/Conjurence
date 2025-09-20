export function getSlot(children: TODO, slot: TODO) {
  return children.find(c => c.type === slot);
}
