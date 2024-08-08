import { Card, CardContent, CardHeader, TextField } from "@mui/material";

const AdditionalData = ({ data, value, onChange }: any) => {
  if (value.paymentMethodCd === "ID_JENIUSPAY") {
    return (
      <Card
        sx={{
          background: `#ffffff url(/images/topup-form-step-3.svg) no-repeat right top`,
        }}
      >
        <CardHeader
          title="Cashtag"
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: "2rem !important",
              letterSpacing: "0.15px !important",
              color: "#1F2937",
              fontWeight: "800",
            },
          }}
        />
        <CardContent
          sx={{
            pt: (theme) => `${theme.spacing(3)} !important`,
            paddingX: "1.25rem",
          }}
        >
          <TextField
            value={value.cashtag}
            autoFocus
            fullWidth
            id="cashtag"
            label="Cashtag"
            sx={{
              marginBottom: 2.5,
              "& .MuiFormLabel-root": { color: "#B72025" },
              "& input": {
                border: "1px solid #B72025",
                borderRadius: "0.4rem",
              },
              "& .MuiInputLabel-root": {
                background: "white",
              },
            }}
            onChange={(e) => onChange("cashtag", e.target.value)}
          />
        </CardContent>
      </Card>
    );
  } else {
    return <></>;
  }
};

export default AdditionalData;
