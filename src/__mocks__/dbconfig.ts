const base = {
  where: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  update: jest.fn(),
  insert: jest.fn(),
  pluck: jest.fn(),
  join: jest.fn().mockReturnThis(),
};

const transaction = jest.fn().mockResolvedValue({
  ...base,
  commit: jest.fn(),
  rollback: jest.fn(),
});

const db = jest.fn(tablename => ({
  ...base,
  transaction,
}));

export { db };
