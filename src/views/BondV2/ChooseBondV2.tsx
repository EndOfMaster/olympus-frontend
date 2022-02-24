import "./ChooseBond.scss";

import { t, Trans } from "@lingui/macro";
import {
  Box,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Metric, MetricCollection, Paper } from "@olympusdao/component-library";
import isEmpty from "lodash/isEmpty";
import { useHistory } from "react-router";
import { useAppSelector, useWeb3Context } from "src/hooks";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { IUserBondDetails } from "src/slices/AccountSlice";
import { IUserNote } from "src/slices/BondSliceV2";

import { formatCurrency } from "../../helpers";
import { BondDataCard, BondTableData } from "./BondRow";
import ClaimBonds from "./ClaimBonds";
import ChooseInverseBond from "./InverseBond/ChooseInverseBond";

function ChooseBondV2() {
  const { networkId } = useWeb3Context();
  const history = useHistory();
  usePathForNetwork({ pathName: "bonds", networkID: networkId, history });

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]).sort((a, b) => b.discount - a.discount);
  });

  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const accountNotes: IUserNote[] = useAppSelector(state => state.bondingV2.notes);

  const marketPrice: number | undefined = useAppSelector(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useAppSelector(state => state.app.treasuryMarketValue);

  const isBondsLoading = useAppSelector(state => state.bondingV2.loading ?? true);

  const formattedTreasuryBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Number(treasuryBalance));

  const v1AccountBonds: IUserBondDetails[] = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  return (
    <div id="choose-bond-view">
      {(!isEmpty(accountNotes) || !isEmpty(v1AccountBonds)) && <ClaimBonds activeNotes={accountNotes} />}

      {/* standard bonds for desktop, mobile is below */}
      <Zoom in={true}>
        <Paper headerText={`${t`Bond`} (4,4)`}>
          <MetricCollection>
            <Metric
              label={t`Treasury Balance`}
              metric={formattedTreasuryBalance}
              isLoading={!!treasuryBalance ? false : true}
            />
            <Metric
              label={t`OHM Price`}
              metric={formatCurrency(Number(marketPrice), 2)}
              isLoading={marketPrice ? false : true}
            />
          </MetricCollection>

          {bondsV2.length == 0 && !isBondsLoading && (
            <Box display="flex" justifyContent="center" marginY="24px">
              <Typography variant="h4">No active bonds</Typography>
            </Box>
          )}

          {!isSmallScreen && bondsV2.length != 0 && (
            <Grid container item>
              <TableContainer>
                <Table aria-label="Available bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">
                        <Trans>Bond</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Price</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Discount</Trans>
                      </TableCell>
                      <TableCell align="left">
                        <Trans>Duration</Trans>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bondsV2.map(bond => {
                      if (bond.displayName !== "unknown")
                        return <BondTableData networkId={networkId} key={bond.index} bond={bond} inverseBond={false} />;
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
          <Box mt={2} className="help-text">
            <em>
              <Typography variant="body2">
                Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim
                as sOHM or gOHM at the end of the term.
              </Typography>
            </em>
          </Box>
        </Paper>
      </Zoom>

      {/* standard bonds for mobile, desktop is above */}
      {isSmallScreen && (
        <Box className="ohm-card-container">
          <Grid container item spacing={2}>
            {bondsV2.map(bond => {
              return (
                <Grid item xs={12} key={bond.index}>
                  <BondDataCard key={bond.index} bond={bond} networkId={networkId} inverseBond={false} />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Inverse Bonds */}
      <ChooseInverseBond />
    </div>
  );
}

export default ChooseBondV2;
