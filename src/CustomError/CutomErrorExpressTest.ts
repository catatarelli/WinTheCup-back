import { ValidationError } from "express-validation";

class CustomErrorExpressTest extends ValidationError {
  code: string;

  constructor(
    public statusCode: number,
    public privateMessage: string,
    public publicMessage: string
  ) {
    super({ body: [] }, {});
  }
}

export default CustomErrorExpressTest;
