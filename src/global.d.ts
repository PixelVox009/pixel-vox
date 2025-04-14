declare global {
    // Sử dụng interface thay vì var
    interface GlobalMongoose {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
    }

    // Khai báo thêm thuộc tính vào đối tượng global
    interface Global {
        mongoose: GlobalMongoose | undefined;
    }

    // Hoặc sử dụng cách khai báo đơn giản hơn:
    // let mongoose: {
    //   conn: typeof import('mongoose') | null;
    //   promise: Promise<typeof import('mongoose')> | null;
    // } | undefined;
}

export { };