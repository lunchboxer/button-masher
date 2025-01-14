# Button Masher

A web app for interactive quiz sessions.

Requires Bun v1.1.14 or higher.

## Getting started

Built from [NedStack template](https://github.com/lunchboxer/nedstack-bun-template).

You'll need to have [atlas](https://atlasgo.io) installed for the database migrations. `curl -sSf https://atlasgo.sh | sh` should do the trick. Run `bun run seed` to create the database, apply the schema and populate with with an initial admin user. With atlas installed run `bun run migrate` to apply any chances made to `./database/schema.sql`.

Create a `.env` file with the following contents:

```env
JWT_SECRET=changeme
```

Run the server with `bun run dev`.

Open [http://localhost:3000](http://localhost:3000) in your browser.

The production server uses brotli to serve static files. So you'll need to run `bun run compress` to update the static compressed files.


## **License**

Button Masher is released under the MIT License. See the **[LICENSE](./LICENSE)** file for details.
