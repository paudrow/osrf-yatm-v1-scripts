export type Requirements = {
  requirements: Requirement[];
};

export type Requirement = {
  name: string;
  description?: string;
  labels?: string[];
  links?: Link[];
  checks: Check[];
};

export type Check = {
  name: string;
  description?: string;
  try?: Step[];
  expect?: Step[];
};

export type Step = Partial<{
  terminal: number;
  imageUrl: string;
  note: string;
  stdin: string;
  stdout: string;
  stderr: string;
}>;

export type Link = {
  name: string;
  url: string;
};
