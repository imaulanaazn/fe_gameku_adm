import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@mui/material";
import React from "react";

export default function GameContent() {
  return (
    <>
      <Box
        mt={{ xs: 18, sm: 16, md: 20 }}
        paddingX={{ md: 20, lg: 30 }}
        paddingY={{ xs: 10 }}
        sx={{ backgroundColor: "rgba(255,255,255,0.4)" }}
      >
        <h1 className="text-lg md:text-xl text-primary-900 text-center font-semibold ">
          Top Up Diamond Mobile Legend Termurah dan Terpercaya
        </h1>
        <Typography
          variant="body1"
          sx={{ color: "#4B5563", fontSize: 14 }}
          mt={3}
          textAlign={{ xs: "left", sm: "center" }}
        >
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nam nihil
          doloribus praesentium illo porro nemo maxime fugit? Impedit, incidunt
          officia voluptatem minima quidem, delectus consequuntur molestias
          labore harum tempore possimus atque esse veritatis error eum eveniet
          corrupti quis commodi libero iusto eaque doloremque vitae temporibus?
          Nulla culpa nisi provident consequuntur dolorem similique dicta! Id
          maxime iusto harum praesentium tenetur explicabo eaque quibusdam
          dolores alias eveniet sint velit, incidunt illum provident amet fuga
          nobis officiis.
        </Typography>
      </Box>

      <TablePrice />
      <GameContentFill />
    </>
  );
}

interface Column {
  id: "name" | "code";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
];

interface Data {
  name: string;
  code: string;
}

function createData(name: string, code: string): Data {
  return { name, code };
}

const rows = [
  createData("India", "IN"),
  createData("China", "CN"),
  createData("Italy", "IT"),
  createData("United States", "US"),
  createData("United States", "US"),
  createData("United States", "US"),
  createData("United States", "US"),
  createData("United States", "US"),
  createData("United States", "US"),
  createData("United States", "US"),
  createData("United States", "US"),
];

function TablePrice() {
  return (
    <>
      <h2 className="text-left text-center font-semibold text-neutral-900 mb-4 mt-10">
        Daftar Harga Game Terbaru
      </h2>
      <Paper
        sx={{
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255,255,255,0.4)",
          width: "100%",
          marginX: "auto",
          boxShadow: "none",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 440,
            maxWidth: { xs: "100%", lg: "70%" },
            marginX: "auto",
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.5)",
                      backdropFilter: "blur(200px)",
                    }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

const gameContentFill =
  "<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore distinctio rem sed sit asperiores nostrum sint a dignissimos ratione iste magni suscipit, corporis minima! Similique rerum qui dignissimos doloribus commodi animi, consectetur consequuntur tempore, quia, nulla tempora iusto nihil autem.</p>";

function GameContentFill() {
  return (
    <Box mt={10}>
      <Typography
        variant="body2"
        sx={{ letterSpacing: "0.25px", marginTop: 1.5 }}
        dangerouslySetInnerHTML={{ __html: gameContentFill }}
      ></Typography>
    </Box>
  );
}
