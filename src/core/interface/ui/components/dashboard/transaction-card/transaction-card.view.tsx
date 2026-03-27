import { Avatar, Box, Card, CardContent, Chip, Icon, Stack, Typography, Link } from "@mui/material";
import React from "react";
import { ICON_MAP, PAGES } from "@interface/presenters/constants";
import { ITransaction } from "@domain/entities/transaction/transaction.entity";
import { TRANSACTION_TYPE } from "@base/core/data/gateways/api/constants";
import {
  Place as PlaceIcon,
  Store as StoreIcon,
  LocalOffer as LocalOfferIcon,
} from "@mui/icons-material";

export interface ITransactionCardView {
  children?: React.ReactNode
  transactions: ITransaction[]
}

const TransactionCardView: React.FC<ITransactionCardView> = (props) => {
  return (
    <>
      {
        props.transactions.length > 0 ? (
          props.transactions.map((item, index) => (
            <Card
              key={`transactioncard-${item.name}-${index}-card`}
              sx={{
                mb: 2,
                borderRadius: 3,
                border: `1px solid ${item.transactionType?.color}`,
              }}
            >
              <CardContent >
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
                  <Stack direction="row" spacing={2} flex={1} alignItems="center">
                    <Avatar sx={{ bgcolor: item.transactionType?.color ?? "secondary", width: "small", height: "small" }}>
                      <Icon component={ICON_MAP[item.transactionType?.icon ?? "Default"]} fontSize="medium" sx={{ color: "white" }} />
                    </Avatar>
                    <Stack direction="column" flexWrap="wrap" flex={1} gap={0.5}>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={2}>
                        {item.store && (
                          <Typography display="flex" alignItems="center" gap={0.5}>
                            <StoreIcon fontSize="inherit" />
                            {item.store.name}
                          </Typography>
                        )}
                        {item.place && (
                          <Typography display="flex" alignItems="center" gap={0.5}>
                            <PlaceIcon fontSize="inherit" />
                            {item.place.name}
                          </Typography>
                        )}
                      </Stack>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {item.category &&
                          <Chip key={`chip-category-${item.category?.id}`} label={item.category?.name} sx={{ backgroundColor: item.category?.color }} size="small" />
                        }
                        {item.tags && item.tags.map((tag, index) => (
                          <Chip icon={<LocalOfferIcon fontSize="inherit" />} key={`chip-tag-${tag.id}`} label={item.tags?.[index].name} size="small"
                            sx={{ backgroundColor: item.tags?.[index].color, "& .MuiChip-icon": { fontSize: "inherit", color: "inherit" } }} />
                        ))
                        }
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {item.transactionAt}
                      </Typography>

                    </Stack>
                    <Typography variant="body1" display="flex" justifyContent="flex-end" fontWeight="bold" color={item.transactionType?.color ?? "primary"}>
                      {
                        item.transactionType?.name === TRANSACTION_TYPE.INCOME.name ?
                          item.formattedNetAmount : item.formattedAmount
                      }
                    </Typography>
                  </Stack>
                </Stack>

              </CardContent>
            </Card>
          ))) : (
          <Box display="flex" bgcolor="background.paper" borderRadius={3} flexDirection="column" justifyContent="center" alignItems="center" minHeight={230}>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              No recent transactions
            </Typography>
          </Box>

        )
      }
      <Box display="flex" justifyContent="flex-end" m={1}>
        <Link href={PAGES.TRANSACTIONS.path}>
          <Typography variant="body2">
            View All Transactions
          </Typography>
        </Link>
      </Box>
    </>
  );
};

export default TransactionCardView;