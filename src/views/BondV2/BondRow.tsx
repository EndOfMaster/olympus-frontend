import "./ChooseBond.scss";

import { t, Trans } from "@lingui/macro";
import { Link, Paper, Slide, SvgIcon, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { TertiaryButton, TokenStack } from "@olympusdao/component-library";
import { NavLink } from "react-router-dom";
import { getEtherscanUrl } from "src/helpers";
import { useAppSelector } from "src/hooks";
import { IBondV2 } from "src/slices/BondSliceV2";

import { ReactComponent as ArrowUp } from "../../assets/icons/arrow-up.svg";
import { NetworkId } from "../../constants";
import { DisplayBondDiscount, DisplayBondPrice } from "./BondV2";

export function BondDataCard({
  bond,
  networkId,
  inverseBond,
}: {
  bond: IBondV2;
  networkId: NetworkId;
  inverseBond: boolean;
}) {
  const isBondLoading = useAppSelector(state => state.bondingV2.loading);

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.index}--bond`} className="bond-data-card ohm-card">
        {/* when not inverse bond show bondable asset */}
        {!inverseBond && (
          <div className="bond-pair">
            <TokenStack tokens={bond.bondIconSvg} />
            <div className="bond-name">
              <Typography>{bond.displayName}</Typography>
              {bond && bond.isLP ? (
                <div>
                  <Link href={bond.lpUrl} target="_blank">
                    <Typography variant="body1">
                      <Trans>Get LP</Trans>
                      <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                    </Typography>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link href={getEtherscanUrl({ bond, networkId })} target="_blank">
                    <Typography variant="body1">
                      <Trans>View Asset</Trans>
                      <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                    </Typography>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TODO (appleseed-inverse): show payout */}
        {/* when IS inverse bond show payout asset */}
        {inverseBond && (
          <div className="bond-pair">
            <TokenStack tokens={bond.bondIconSvg} />
            <div className="bond-name">
              <Typography>{bond.displayName}</Typography>
              {bond && bond.isLP ? (
                <div>
                  <Link href={bond.lpUrl} target="_blank">
                    <Typography variant="body1">
                      <Trans>Get LP</Trans>
                      <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                    </Typography>
                  </Link>
                </div>
              ) : (
                <div>
                  <Link href={getEtherscanUrl({ bond, networkId })} target="_blank">
                    <Typography variant="body1">
                      <Trans>View Asset</Trans>
                      <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                    </Typography>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="data-row">
          <Typography>
            <Trans>Price</Trans>
          </Typography>
          <Typography className="bond-price">
            <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Discount</Trans>
          </Typography>
          <Typography>
            {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.index} bond={bond} />}
          </Typography>
        </div>
        <div className="data-row">
          <Typography>
            <Trans>Duration</Trans>
          </Typography>
          <Typography>{isBondLoading ? <Skeleton width="50px" /> : bond.duration}</Typography>
        </div>

        <Link component={NavLink} to={`/bonds/${bond.index}`}>
          <TertiaryButton fullWidth disabled={bond.soldOut}>
            {bond.soldOut ? t`Sold Out` : t`Bond ${bond.displayName}`}
          </TertiaryButton>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({
  bond,
  networkId,
  inverseBond,
}: {
  bond: IBondV2;
  networkId: NetworkId;
  inverseBond: boolean;
}) {
  // Use BondPrice as indicator of loading.
  const isBondLoading = !bond.priceUSD ?? true;

  return (
    <TableRow id={`${bond.index}--bond`}>
      <TableCell align="left" className="bond-logo-cell">
        <div className="logo-container">
          <TokenStack tokens={bond.bondIconSvg} />
          <div className="bond-name">
            {bond && bond.isLP ? (
              <>
                <Typography variant="body1">{bond.displayName}</Typography>
                <Link color="primary" href={bond.lpUrl} target="_blank">
                  <Typography variant="body1">
                    <Trans>Get LP</Trans>
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </Typography>
                </Link>
              </>
            ) : (
              <>
                <Typography variant="body1">{bond.displayName}</Typography>
                <Link color="primary" href={getEtherscanUrl({ bond, networkId })} target="_blank">
                  <Typography variant="body1">
                    <Trans>View Asset</Trans>
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </Typography>
                </Link>
              </>
            )}
          </div>
        </div>
      </TableCell>
      {/* payout asset for inverse bonds */}
      {inverseBond && (
        <TableCell align="left" className="bond-logo-cell">
          <div className="logo-container">
            <TokenStack tokens={bond.bondIconSvg} />
            <div className="bond-name">
              <>
                <Typography variant="body1">{bond.displayName}</Typography>
                <Link color="primary" href={getEtherscanUrl({ bond, networkId })} target="_blank">
                  <Typography variant="body1">
                    <Trans>View Asset</Trans>
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </Typography>
                </Link>
              </>
            </div>
          </div>
        </TableCell>
      )}
      <TableCell align="left">
        <Typography>
          <>{isBondLoading ? <Skeleton width="50px" /> : <DisplayBondPrice key={bond.index} bond={bond} />}</>
        </Typography>
      </TableCell>
      <TableCell align="left">
        {isBondLoading ? <Skeleton width="50px" /> : <DisplayBondDiscount key={bond.index} bond={bond} />}
      </TableCell>
      <TableCell align="left">{isBondLoading ? <Skeleton /> : bond.duration}</TableCell>
      <TableCell>
        <Link component={NavLink} to={`/bonds/${bond.index}`}>
          <TertiaryButton fullWidth disabled={bond.soldOut}>
            {bond.soldOut ? t`Sold Out` : t`do_bond`}
          </TertiaryButton>
        </Link>
      </TableCell>
    </TableRow>
  );
}
